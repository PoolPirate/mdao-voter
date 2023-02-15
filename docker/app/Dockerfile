FROM node:16 AS build-web

WORKDIR /app

RUN apt update && apt install nano wget curl git -y

RUN git clone https://github.com/PoolPirate/mdao-voter.git /fullsource

RUN cp /fullsource/* /app -R

RUN npm install
RUN npx hardhat compile

WORKDIR /app/frontend

RUN npm install
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-api

WORKDIR /root

RUN echo "Cloning code"
RUN git clone https://github.com/PoolPirate/mdao-voter.git /fullsource

RUN cp /fullsource/backend /source -R
COPY --from=build-web /app/frontend/build /source/MDAO-Voter-Backend/wwwroot

WORKDIR /source/

RUN ls

RUN echo "Restoring Deps"
RUN dotnet restore -r linux-x64 /p:PublishReadyToRun=true

RUN echo "Compiling Application"
RUN dotnet publish -c Release -o /app -r linux-x64 --self-contained true --no-restore /p:PublishTrimmed=true /p:PublishReadyToRun=true /p:PublishSingleFile=true

FROM mcr.microsoft.com/dotnet/runtime-deps:7.0-bullseye-slim-amd64
WORKDIR /app
COPY --from=build-api /app .
COPY appsettings.json .

CMD ["./MDAO-Voter"]