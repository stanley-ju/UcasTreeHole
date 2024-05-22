FROM golang:1.20.6

ENV GOPROXY https://goproxy.cn,direct
WORKDIR /go/treehole/backend
COPY . /go/treehole/backend

RUN mkdir /go/treehole/backend/imgs
RUN go build .

EXPOSE 8080
ENTRYPOINT ["./backend"]