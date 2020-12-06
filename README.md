# Final Project

## Amazon EC2  
### Connect  
`ssh -i "csc667key.pem" ubuntu@ec2-18-191-127-85.us-east-2.compute.amazonaws.com`  

---------

## MongoDB (https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)  
### Install
Import the public key used by the package management system  
`wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -`

Add Sources  
`echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list`

Reload the local package database  
`sudo apt update`

Install the MongoDB packages  
`sudo apt install -y mongodb-org`

Change bindIP to 0.0.0.0 in mongod.conf  
`sudo vim /etc/mongod.conf`

Start and verify the service  
`sudo systemctl start mongod`  
`sudo systemctl status mongod`

Enable the service start on every reboot  
`sudo systemctl enable mongod`

Restart MongoDB  
`sudo systemctl restart mongod`

(IF NEEDED) Stop MongoDB  
`sudo systemctl stop mongod`

(IF NEEDED) Restart MongoDB  
`sudo systemctl restart mongod`
or  
`sudo service mongod restart`  

---------

## Redis  
Start Sever  
`redis-server`

