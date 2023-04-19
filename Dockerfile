FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /
COPY . ./
RUN dotnet restore
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /
COPY --from=build-env /out .
ENTRYPOINT ["dotnet", "StartFromScratch.dll"]




FROM node:16-alpine AS builder
ENV NODE_ENV production

WORKDIR /adminapp/app

COPY ./package.json ./
COPY package-lock.json .
RUN npm install

COPY . .

RUN npm run build

FROM nginx

# Copying built assets from builder
COPY --from=builder /adminapp/app/build /usr/share/nginx/html

# Copying our nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]