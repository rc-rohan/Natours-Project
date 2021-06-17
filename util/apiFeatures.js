//Here we have included all the features that we can apply upon any API and modify that
//like SORT ,FITER, PAGINATE, 
class APIFetaures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A. FILTERING
    const queryObj = { ...this.query };
    const excludefileds = ['page', 'sort', 'limit', 'fields'];
    excludefileds.forEach((el) => delete queryObj[el]); //delete the elemtns if present

    // 1B.) ADVANCE FILTERING
    let queryStr = JSON.stringify(queryObj);
    //writing the regular expression for replacing the string values
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this; //returns entire object of query and queryString in constructor
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);

      return this;
    }
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); //include the fields in the response
    } else {
      this.query = this.query.select('-__v'); // "-" :to exculde the fields from the response
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1; //multiplying with 1 to convert string to number
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFetaures;
