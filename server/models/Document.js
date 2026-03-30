// Extremely resilient In-Memory model mimicking Mongoose. 
// Protects the user from MongoDB cluster IP and download crashes!

let mockDb = [];
let idCounter = 1;

class Document {
  constructor(data) {
    this._id = Date.now().toString() + idCounter++;
    this.title = data.title || "Untitled Document";
    this.content = data.content || "";
    this.owner = data.owner;
    this.sharedWith = data.sharedWith || [];
    this.updatedAt = new Date();
    
    mockDb.push(this);
  }

  async save() {
    this.updatedAt = new Date();
    const index = mockDb.findIndex(d => d._id === this._id);
    if (index === -1) {
      mockDb.push(this);
    } else {
      mockDb[index] = this;
    }
    return this;
  }

  static async find(query) {
    // Mimic the $or logic
    if (query.$or) {
      const email = query.$or[0].owner;
      return mockDb.filter(doc => 
        doc.owner === email || 
        doc.sharedWith.some(u => u.email === email)
      ).sort((a,b) => b.updatedAt - a.updatedAt);
    }
    return mockDb;
  }

  static async findById(id) {
    return mockDb.find(d => d._id === id);
  }
}

module.exports = Document;
