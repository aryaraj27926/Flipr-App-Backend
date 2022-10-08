#!/bin/bash

sudo docker rm app_backend_cont -f

id=$(sudo docker images app_backend -q)

sudo docker build --rm -t app_backend .

sudo docker run -dp 3000:3000 --name app_backend_cont app_backend

new_id=$(sudo docker images app_backend -q)

if [ $id == $new_id ]
    then
    sudo docker rmi $(sudo docker images --filter "dangling=true" -q)
    else
    sudo docker image rm $id
    sudo docker rmi $(sudo docker images --filter "dangling=true" -q)
fi
