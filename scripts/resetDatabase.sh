cd ..

docker-compose down -v

rm -rf ./postgresql/data/*

docker-compose up -d --build