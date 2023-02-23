pipeline {
    agent {
        docker {image 'node:18.13.0-alpine'}
    }
    stages {
        stage('Test') {
            steps {

                 browserstack(credentialsId: '779a06e2-8e81-4b91-89cb-941ad889a83e') {
       
                sh 'node --version'
                print('========================================================================================================')
                print('Modules Install')
                print('========================================================================================================')
                sh 'npm install'
                print('========================================================================================================')
                print('Run Functional Tests - ' + 'Case: ' + env.TAGS)
                print('========================================================================================================')
                sh '''
                    npm run browserstack -- --cucumberOpts.tagExpression="$TAGS"
                '''
            }}
        }
    }
}