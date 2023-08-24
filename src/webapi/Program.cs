using static System.Net.Mime.MediaTypeNames;
using webapi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options => options.AddPolicy("CorsPolicy",
            builder =>
            {
                builder.WithOrigins("https://localhost:4200")
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       .SetIsOriginAllowed((host) => true)
                       .AllowCredentials();
            }));

builder.Services.AddSignalR(o =>
{
    o.EnableDetailedErrors = true;
    o.EnableDetailedErrors = true;
});

builder.Services.AddSingleton<IChatRepository, ChatRepository>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseWebSockets();
app.UseHttpsRedirection();
app.UseAuthorization();

app.UseCors("CorsPolicy");
//app.UseCors("AllowAngularOrigins");
app.MapControllers();

app.MapHub<ChatHub>("chathub");

app.Run();
public partial class Program { }