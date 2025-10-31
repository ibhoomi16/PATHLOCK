# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["PLC3/SmartSchedulerAPI/SmartSchedulerAPI.csproj", "PLC3/SmartSchedulerAPI/"]
RUN dotnet restore "PLC3/SmartSchedulerAPI/SmartSchedulerAPI.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/PLC3/SmartSchedulerAPI"
RUN dotnet build "SmartSchedulerAPI.csproj" -c Release -o /app/build

# Publish
RUN dotnet publish "SmartSchedulerAPI.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SmartSchedulerAPI.dll"]
