🗄️ A Web application to manage databases.

Rust-DB-Manager, powered by Rust!

This manager provides an abstract interface to manage multiple MongoDB connections (SQL implementations comming soon) with a single instance.

MongoExpress has been clearly an inspiration for this project. At this moment, 0.1.0 version, it has more than 75% of mongo-expres's functionality.
It has a sober interface and is arround 50% faster when MongoDB instance is in the same network.

Localhost is not allowed!

Please, for a better user experience, use MongoDB in the same network:

-- m̶o̶n̶g̶o̶d̶b̶:̶/̶/̶r̶o̶o̶t̶:̶e̶x̶a̶m̶p̶l̶e̶@̶l̶o̶c̶a̶l̶h̶o̶s̶t̶:̶2̶7̶0̶1̶7̶
-- mongodb://root:example@mongodb:27017