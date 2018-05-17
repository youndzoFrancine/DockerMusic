FROM node:4.3.1
MAINTAINER Francine Youndzo <francine.youndzok@heig-vd.ch>

#
# When we build the image, we copy the executable jar in the image file system. 
#

RUN npm install moment
EXPOSE 2205
COPY  src /opt/app/

ENTRYPOINT ["node", "/opt/app/auditor.js"]
