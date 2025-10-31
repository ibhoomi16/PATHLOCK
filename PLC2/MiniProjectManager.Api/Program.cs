using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MiniProjectManager.Api.Data;
using MiniProjectManager.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ----------------------
// 1️⃣  Add basic services
// ----------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ----------------------
// CORS: allow frontend (http://localhost:3000)
// ----------------------
const string FrontendCorsPolicy = "FrontendCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
        policy
            .WithOrigins(
                "http://localhost:3000",
                "http://127.0.0.1:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
    );
});

// ----------------------
// 2️⃣  Configure Swagger + JWT support
// ----------------------
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Mini Project Manager API", 
        Version = "v1" 
    });

    // JWT Auth setup for Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Enter JWT as: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ----------------------
// 3️⃣  Configure Database (In-Memory for disk space issues)
// ----------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("MiniProjectManagerDb")
);

// ----------------------
// 4️⃣  Configure JWT Authentication
// ----------------------
var jwtKey = builder.Configuration["Jwt:Key"] ?? "super-secret-jwt-key-min-32chars-long-1234567890";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "MiniProjectManager";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "MiniProjectManagerClient";

var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ClockSkew = TimeSpan.Zero
    };
});

// Add Token Service
builder.Services.AddScoped<ITokenService, TokenService>();

// ----------------------
// 5️⃣  Build the App
// ----------------------
var app = builder.Build();

// Auto-create database on startup (In-Memory DB doesn't need migrations)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); // Creates schema for in-memory DB
}

// ----------------------
// 6️⃣  Enable Swagger (always on)
// ----------------------
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Mini Project Manager API v1");
    c.RoutePrefix = string.Empty; // Swagger at root (http://localhost:5014)
});

// ----------------------
// 7️⃣  Configure pipeline
// ----------------------
app.UseHttpsRedirection();

// Apply CORS before auth
app.UseCors(FrontendCorsPolicy);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
