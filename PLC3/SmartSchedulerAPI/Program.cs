using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Step 1: Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React app URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SmartScheduler API", Version = "v1" });
});

var app = builder.Build();

// Step 2: Enable Swagger (optional, for testing API)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Step 3: Enable CORS before Authorization and MapControllers
app.UseCors("AllowReactApp");

// app.UseHttpsRedirection(); // optional; comment if causing SSL issues
app.UseAuthorization();

app.MapControllers();

app.Run();
