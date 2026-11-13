javac --release 21 -d out src\larp\*.java
jar cf web\public\larp.jar -C out .