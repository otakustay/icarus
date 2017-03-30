rm -rf dist

mkdir dist

for dir in service common static
do
    cp -r $dir dist/
    babel "$dir/**/*.js" "$dir/*.js" --out-dir dist/
done

babel *.js --out-dir dist/

cp -r 3rd .logrc package.json dist/

if [ "$1" == "--install" ]
then
    cd dist
    npm install --production
    cd ..
fi
