PKG_NAME = web-ext-slovnikcz.zip
SRC = \
background.js \
content.js \
LICENSE \
_locales \
manifest.json \
slovnikcz-small.png \
slovnikcz-tiny.png

all:
	zip -r ${PKG_NAME} ${SRC}

clean:
	rm -rf ${PKG_NAME}
