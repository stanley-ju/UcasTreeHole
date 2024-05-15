### Use docker to build backend  
    - `docker pull mysql`  
    - `docker pull tomcat`
    - go to `/backend` and run `docker build -t treehole_backend .`  
    - go to `/docker` and run `docker compose -f ./docker-compose.yml up -d --build`
