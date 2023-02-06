using System.Text.Json.Serialization;

namespace StartFromScratch.Common;

public abstract class BaseAuditableEntity : BaseEntity
{
    public DateTime Created { get; set; }

    [JsonIgnore]
    public int? CreatedBy { get; set; }
    [JsonIgnore]
    public DateTime? LastModified { get; set; }
    [JsonIgnore]
    public int? LastModifiedBy { get; set; }
}
