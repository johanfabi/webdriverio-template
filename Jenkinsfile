pipeline {
    agent {
        docker { image 'node:18.13.0-alpine' }
    }
    stages {
        stage('Test') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'browserstack-credentials',usernameVariable: 'BROWSERSTACK_USERNAME',passwordVariable: 'BROWSERSTACK_ACCESS_KEY')

                ])
                {
                    script {
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
                    }
                }
            }
        }
    }
}