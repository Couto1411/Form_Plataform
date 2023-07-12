#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["backendcsharp/backendcsharp.csproj", "backendcsharp/"]
COPY ["APIs.Security.JWT/APIs.Security.JWT.csproj", "APIs.Security.JWT/"]
RUN dotnet restore "backendcsharp/backendcsharp.csproj"
COPY . .
WORKDIR "/src/backendcsharp"
RUN dotnet build "backendcsharp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "backendcsharp.csproj" -c Release -o /app/publish /p:UseAppHost=true

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "backendcsharp.dll"]