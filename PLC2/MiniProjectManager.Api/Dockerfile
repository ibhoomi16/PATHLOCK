# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["PLC2/MiniProjectManager.Api/MiniProjectManager.Api.csproj", "PLC2/MiniProjectManager.Api/"]
RUN dotnet restore "PLC2/MiniProjectManager.Api/MiniProjectManager.Api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/PLC2/MiniProjectManager.Api"
RUN dotnet build "MiniProjectManager.Api.csproj" -c Release -o /app/build

# Publish
RUN dotnet publish "MiniProjectManager.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MiniProjectManager.Api.dll"]