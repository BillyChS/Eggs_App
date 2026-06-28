using System.Text.Json.Serialization;

namespace Eggs_App.API.Infrastructure.Data.Entities;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum PaymentStatus
{
    Paid = 0,
    Pending = 1
}
