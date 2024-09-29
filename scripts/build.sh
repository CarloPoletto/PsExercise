DIR_INIT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DIR_ROOT=$DIR_INIT/..
DIR_REACT=$DIR_ROOT/reactjs

cd $DIR_ROOT
rm -rf $DIR_REACT/build
rm -rf $DIR_ROOT/aspnetapp/aspnetapp/wwwroot/*.*

cd $DIR_REACT
yarn
yarn development

cd $DIR_ROOT
mv $DIR_REACT/build/* $DIR_ROOT/aspnetapp/aspnetapp/wwwroot

cd $DIR_ROOT
docker-compose down -v
docker-compose up -d --build
docker-compose logs -f aspnetapp