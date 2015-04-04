using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using NgWebApiGrid.Data;
using NgWebApiGrid.Data.Models;

namespace NgWebApiGrid.Web.Controllers
{
    public class StudentsApiController : ApiController
    {
        private readonly SchoolContext db = new SchoolContext();

        // GET: api/Students
        public StudentsContainer GetStudents(int currentPage, int recordsPerPage, string sortKey, string sortOrder, string searchfor)
        {

            var pageNumber = currentPage;
            var pageSize = recordsPerPage;
            var begin = (pageNumber - 1) * pageSize;

            var totalNumberOfRecords = db.Students.Count(r => searchfor == "null" || r.LastName.Contains(searchfor) || r.FirstMidName.Contains(searchfor));
            List<Student> results = null;
            switch (sortOrder)
            {
                case "ASC":
                    switch (sortKey)
                    {
                        case "lastName":
                            results = db.Students.Where(r => searchfor == "null" || r.LastName.Contains(searchfor) || r.FirstMidName.Contains(searchfor)).OrderBy(r => r.LastName).Skip(begin).Take(pageSize).ToList();
                            break;
                        case "firstName":
                            results = db.Students.Where(r => searchfor == "null" || r.LastName.Contains(searchfor) || r.FirstMidName.Contains(searchfor)).OrderBy(r => r.FirstMidName).Skip(begin).Take(pageSize).ToList();
                            break;
                    }
                    break;
                case "DESC":
                    switch (sortKey)
                    {
                        case "lastName":
                            results = db.Students.Where(r => searchfor == "null" || r.LastName.Contains(searchfor) || r.FirstMidName.Contains(searchfor)).OrderByDescending(r => r.LastName).Skip(begin).Take(pageSize).ToList();
                            break;
                        case "firstName":
                            results = db.Students.Where(r => searchfor == "null" || r.LastName.Contains(searchfor) || r.FirstMidName.Contains(searchfor)).OrderByDescending(r => r.FirstMidName).Skip(begin).Take(pageSize).ToList();
                            break;
                    }
                    break;
            }



            var students =
                results.Select(
                    r =>
                        new Student
                        {
                            EnrollmentDate = r.EnrollmentDate,
                            FirstMidName = r.FirstMidName,
                            LastName = r.LastName,
                            ID = r.ID
                        }).ToList();

            var studentsContainer = new StudentsContainer { Students = students, RecordCount = totalNumberOfRecords };

            return studentsContainer;
        }

        // GET: api/Students/5
        [ResponseType(typeof(Student))]
        public async Task<IHttpActionResult> GetStudent(int id)
        {
            Student student = await db.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            return Ok(student);
        }

        // PUT: api/Students/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutStudent(int id, Student student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != student.ID)
            {
                return BadRequest();
            }

            db.Entry(student).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Students
        [ResponseType(typeof(Student))]
        public async Task<IHttpActionResult> PostStudent(Student student)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Students.Add(student);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = student.ID }, student);
        }

        // DELETE: api/Students/5
        [ResponseType(typeof(Student))]
        public async Task<IHttpActionResult> DeleteStudent(int id)
        {
            Student student = await db.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            db.Students.Remove(student);
            await db.SaveChangesAsync();

            return Ok(student);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StudentExists(int id)
        {
            return db.Students.Count(e => e.ID == id) > 0;
        }
    }

    public class StudentsContainer
    {
        public List<Student> Students { get; set; }
        public int RecordCount
        { get; set; }
    }
}