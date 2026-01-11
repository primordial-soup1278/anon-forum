# build stage
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .

# make gradlew executable
RUN CHMOD +x ./gradlew

RUN ./gradlew bootJar --no-daemon
# runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]