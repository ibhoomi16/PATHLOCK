# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["PLC1/TaskManagerAPI/TaskManagerAPI.csproj", "PLC1/TaskManagerAPI/"]
RUN dotnet restore "PLC1/TaskManagerAPI/TaskManagerAPI.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/PLC1/TaskManagerAPI"
RUN dotnet build "TaskManagerAPI.csproj" -c Release -o /app/build

# Publish
RUN dotnet publish "TaskManagerAPI.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TaskManagerAPI.dll"]
