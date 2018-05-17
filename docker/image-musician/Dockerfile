FROM node:4.3.1
MAINTAINER Francine Youndzo <francine.youndzok@heig-vd.ch>

#
# When we build the image, we copy the executable jar in the image file system. 
#

ADD src /opt/app/

WORKDIR /opt/app/

RUN npm install 


ENTRYPOINT ["node", "/opt/app/musician.js"]
