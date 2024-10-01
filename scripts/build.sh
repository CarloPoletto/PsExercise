DIR_INIT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIR_ROOT=$DIR_INIT/..
DIR_REACT=$DIR_ROOT/frontend

cd $DIR_ROOT
mkdir -p $DIR_ROOT/backend/wwwroot

rm -rf $DIR_REACT/build
rm -rf $DIR_ROOT/backend/wwwroot/*.*

cd $DIR_REACT
yarn
yarn development

cd $DIR_ROOT
mv $DIR_REACT/build/* $DIR_ROOT/backend/wwwroot

cd $DIR_ROOT
docker-compose down -v
docker-compose up -d --build
docker-compose logs -f backend