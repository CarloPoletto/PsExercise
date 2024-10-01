cd ..

docker-compose down -v

rm -rf ./database/data/*

docker-compose up -d --build