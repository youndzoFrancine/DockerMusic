FROM node:4.3.1
MAINTAINER Francine Youndzo <francine.youndzok@heig-vd.ch>

#
# When we build the image, we copy the executable jar in the image file system. 
#


WORKDIR /opt/app/
RUN npm install moment
RUN npm Install node-uuid

EXPOSE src 2205

COPY src /opt/app/

ENTRYPOINT ["node", "/opt/app/musician.js"]
