# Amazon EC2  
### Connect via SSH:  
`ssh -i "csc667key.pem" ubuntu@ec2-18-191-127-85.us-east-2.compute.amazonaws.com`  

<br>
<br>
<br>
  
# Running Application on EC2
### Install Docker on EC2  
Install Docker using:  
`https://docs.docker.com/engine/install/ubuntu/`  

Install docker-compose:  
`sudo apt install docker-compose`  

### Get Application Code from Github  
`git clone https://github.com/sfsu-csc-667-fall-2020/final-project-final_project_jlpsahsb.git`  

### Run  
Deploy Application (Ensure you `cd` into back_end folder):  
 `npm run deploy`  

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
