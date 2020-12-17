# Amazon EC2  

### EC2 IP Address:  
`TBD`  

### Connect via SSH:  
`TBD`  

<br>
<br>
<br>
  
# Running Application on EC2  
### Install Docker on EC2  
Set up Docker repositoy before downloading Docker using:  
`sudo apt-get update`  
`sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common`  
`curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`  
`sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"`

Install Docker using:  
`sudo apt-get update`  
`sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose npm`

Login to Docker using:
`sudo docker login`  
 
### Get Application Code from Github  
`git clone https://github.com/sfsu-csc-667-fall-2020/final-project-final_project_jlpsahsb.git`  
`cd final-project-final_project_jlpsahsb/back_end/`  

### Run  
Deploy Application (Ensure you `cd` into back_end folder):  
`sudo npm run pull:all`  
`sudo docker swarm init`  
`sudo docker stack deploy -c ../docker-compose.yml simpleCraig`  
 `sudo npm run deploy`  

<br>
<br>
<br>
  
# MISC DOCKER COMMANDS
### Leave swarm:  
`docker swarm leave --force`

### Delte all images:  
`docker image prune -a`  

### Delte all volumes:  
`docker volume prune`  
