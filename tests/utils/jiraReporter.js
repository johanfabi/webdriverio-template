import path from 'path';

export default class JiraReport {
    JIRA_URL = "https://projectmanagement.appslatam.com";
    BASE_RUN_PATH = "/rest/atm/1.0/testrun/";
    BASE_ATTACHMENT_PATH = "/rest/atm/1.0/testresult/";
    TEST_RESULT_PATH = "/testresults";
    TEST_ATTACHMENT_PATH = "/attachments";
    SUCCESS_STATUS = "PASSED";
    PASSED = "Pass";
    FAILED = "Fail";
    EVIDENCE_BASE_DIR = "screenShots"; // requiere ser definido

    constructor() {
        this.userName = process.env.JIRA_USERNAME;
        this.password = process.env.JIRA_PASSWORD;
        this.jiraBearerToken = process.env.JIRA_TOKEN;
        this.executedBy = process.env.JIRA_EXECUTED_BY != null ? process.env.JIRA_EXECUTED_BY : this.userName;
        this.os = null;
        this.osVersion = null;
        this.comment = null;
        this.browser = null;
        this.browserVersion = null;
        this.executionTime = null;
        this.networklogs = null;
        this.projectBaseDir = process.cwd();
        this.automationSession = null;
        this.buildId = null;
    }

    async reportToZephyrResult(status, testCycle, testCaseKey, type, urlFilter, 
                        runEnvironment, testStartMillis, testEndMillis, extraDetails) {

        status = status === this.SUCCESS_STATUS ? this.PASSED : this.FAILED;
        let jiraPath = this.JIRA_URL + this.BASE_RUN_PATH + testCycle + this.TEST_RESULT_PATH;

        console.log("PATH JIRA URL: " + jiraPath);

        await this.setEssentialsValues();

        switch(process.env.RUNNING_ON) {
            case "local":
                this.localExecution(testStartMillis, testEndMillis, extraDetails);
                break;
            case "browserstack":
                this.browserStackExecution(type, extraDetails);
                break;
        }

        console.log("os: " + this.os);
        console.log("osVersion: " + this.osVersion);
        console.log("browser: " + this.browser);
        console.log("scenario name: " + process.env.SCENARIO_NAME);

        let bodyRequest = this.buildBody(status, testCaseKey, runEnvironment);
        let id = await this.sendReportToJira(jiraPath, bodyRequest, "POST");
        console.log("ID RETURNED FROM FX: " + id);

        //attach evidence
        jiraPath = this.JIRA_URL + this.BASE_ATTACHMENT_PATH + id + this.TEST_ATTACHMENT_PATH;
        //this.attachEvidenceToZephyr(path);
    }

    localExecution(testStartMillis, testEndMillis, extraDetails) {
        this.executionTime = testEndMillis - testStartMillis;
        let comment = "Ejecucion local de pruebas de desarrollo automatizadas";
        this.addComments(comment, extraDetails);
    }

    // sessionId se obtiene mediante process.env.SESSION_ID
    browserStackExecution(type, extraDetails) {
        let comment = "<br/><a href=" + this.automationSession.video_url + "><b>Video Url</b></a><br/>";
        comment = comment  + "<br/><a href=" + this.automationSession.logs + "><b>Logs Url</b></a><br/>";
        comment = comment  + "<br/><a href=" + this.automationSession.browser_url + "><b>Browser Url</b></a><br/>";
        comment = comment  + "<br/><a href=" + this.automationSession.public_url + "><b>Public Url</b></a><br/>";
        this.addComments(comment, extraDetails);

        //FALTA INYECTAR NETWORK_LOGS
    }

    async setEssentialsValues() {
        switch (process.env.RUNNING_ON) {
            case "local":
                this.os = process.env.OS;
                this.osVersion = process.env.OS_VERSION;
                this.browser = process.env.BROWSER_NAME;
                this.browserVersion = process.env.BROWSER_VERSION;
                break;
            case "browserstack":
                let response = await browser.execute('browserstack_executor: {"action": "getSessionDetails"}');
                this.automationSession = JSON.parse(response);
                this.os = this.automationSession.os;
                this.osVersion = this.automationSession.os_version;
                this.browser = this.automationSession.browser;
                this.browserVersion = this.automationSession.browser_version;
                this.buildId = this.automationSession.build_hashed_id; //podria ser también hashed_id
                this.networklogs = process.env.BROWSERSTACK_NETWORKLOGS;
                break;
        }
    }

    addComments(comment, extraDetails) {
        this.comment = comment;
        if(extraDetails != null) {
            this.comment = this.comment + "<b>Comentarios Adicionales</b><br/>" + extraDetails + "<br/>";
        }
    }

    async sendReportToJira(path, bodyRequest, usedMethod) {
        let auth = this.getAuthenticationMethod();
        let reqHeaders = new Headers();
        reqHeaders.append("Content-Type", "application/json");
        reqHeaders.append("Authorization", auth);

        let request = {
            headers: reqHeaders,
            body: bodyRequest,
            method: usedMethod
        }

        let result = await fetch(path, request)
                    .then(response => {
                        console.log("STATUS CODE: " + response.status);
                        return response.json();
                    })
                    .then(data => {
                        return data[0].id.toString();
                    })
                    .catch(error => {
                        console.log("Error: " + error);
                    });

        return result;
    }

    async attachEvidenceToZephyr(pathUrl) { //FALTA DEFINIR BIEN CARPETA DE EVIDENCIAS PARA CONTINUAR CON ESTE METODO
        let auth = this.getAuthenticationMethod();
        let fileRelativePath = this.projectBaseDir + path.sep + this.EVIDENCE_BASE_DIR;
        let fileEvidence = new File([fileRelativePath], process.env.SCENARIO_NAME + ".png", {type: "image/png"});
    }

    getAuthenticationMethod() {
        let result;
        if(this.jiraBearerToken != null) {
            result = "Bearer " + this.jiraBearerToken;
        } else {
            let toEncode = this.userName + ":" + this.password;
            result = "Basic " +  Buffer.from(toEncode).toString('base64');
        }

        console.log("Autenticacion: " + result);
        return result;
    }

    buildBody(status, testCaseKey, runEnvironment) {
        let body = [{
            "status": status,
            "testCaseKey": testCaseKey,
            "environment": runEnvironment,
            "executionTime": this.executionTime,
            "executedBy": this.executedBy,
            "assignedTo": this.executedBy,
            "scriptResults": [{
                "index": 0,
                "status": status,
                "comment": status
            }],
            "customFields": {
                "Sistema Operativo": this.os,
                "Sistema Operativo Version": this.osVersion,
                "Navegador": this.browser,
                "Version Navegador": this.browserVersion
            },
            "comment": this.comment
        }];

        return JSON.stringify(body);
    }
}