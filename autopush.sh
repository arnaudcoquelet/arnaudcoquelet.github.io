#/bin/sh

cd /root/arnaudcoquelet.github.io

#Auto commit and push

git add .
git commit -m "Update $(date +%x_%H:%M:%S)"
#git push
git push -u origin master

