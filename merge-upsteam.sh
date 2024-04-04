!/bin/sh

# add upstream
git remote add upstream git@github.com:kingstinct/react-native-healthkit.git
# fetch changes from upstream
git fetch upstream

# creare upgrade branch from master
git checkout master; git checkout -b upgrade-v7.3.x
# merge changes from upstream
git merge upstream/master upgrade-v7.3.x
# merge conflicts & git merge --continue

# tag version for verification and push branch
git tag -a v7.3.x-rev0 -m v7.3.x-rev0
git push --tags
git push -f origin/upgrade-v7.3.x

# remove upsteam
git remote remove upstream
