class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",  //To make Case Insensitive
            }
            
        }
        :{};
        this.query = this.query.find({...keyword});

        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        
        //Remove Some Fields For Category
        const removeFields = ["keyword","page", "limit"];
        removeFields.map(field => delete queryCopy[field]);

        //Filter for Price And Rating

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}` );  //Strictly This Code(Space Should not be There in between the gt,lt,gte,lte)
        
        
        this.query = this.query.find(JSON.parse(queryStr));
        
        return this;
    }
}

module.exports = ApiFeatures;