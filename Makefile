all:
	./dpkg-scanpackages -m debs /dev/null | gzip -9c > Packages.gz
