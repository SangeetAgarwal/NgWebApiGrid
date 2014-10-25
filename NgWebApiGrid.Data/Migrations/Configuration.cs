using System.Collections.Generic;
using NgWebApiGrid.Data.Models;

namespace NgWebApiGrid.Data.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<NgWebApiGrid.Data.SchoolContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(NgWebApiGrid.Data.SchoolContext context)
        {
            var students = new List<Student>
            {
            new Student{FirstMidName="Carson",LastName="Alexander",EnrollmentDate=DateTime.Parse("2005-09-01")},
            new Student{FirstMidName="Meredith",LastName="Alonso",EnrollmentDate=DateTime.Parse("2002-09-01")},
            new Student{FirstMidName="Arturo",LastName="Anand",EnrollmentDate=DateTime.Parse("2003-09-01")},
            new Student{FirstMidName="Gytis",LastName="Barzdukas",EnrollmentDate=DateTime.Parse("2002-09-01")},
            new Student{FirstMidName="Yan",LastName="Li",EnrollmentDate=DateTime.Parse("2002-09-01")},
            new Student{FirstMidName="Peggy",LastName="Justice",EnrollmentDate=DateTime.Parse("2001-09-01")},
            new Student{FirstMidName="Laura",LastName="Norman",EnrollmentDate=DateTime.Parse("2003-09-01")},
            new Student{FirstMidName="Nino",LastName="Olivetto",EnrollmentDate=DateTime.Parse("2005-09-01")},
            new Student{FirstMidName="Darson",LastName="Olivia",EnrollmentDate=DateTime.Parse("2005-09-01")},
            new Student{FirstMidName="Cheryl",LastName="Bruto",EnrollmentDate=DateTime.Parse("2002-09-01")},
            new Student{FirstMidName="Angus",LastName="Doritho",EnrollmentDate=DateTime.Parse("2003-09-01")},
            new Student{FirstMidName="Jeves",LastName="Baldaros",EnrollmentDate=DateTime.Parse("2002-09-01")},
            new Student{FirstMidName="Kan",LastName="Chan",EnrollmentDate=DateTime.Parse("2002-09-01")},
            new Student{FirstMidName="David",LastName="Stosky",EnrollmentDate=DateTime.Parse("2001-09-01")},
            new Student{FirstMidName="Lauda",LastName="Chris",EnrollmentDate=DateTime.Parse("2003-09-01")},
            new Student{FirstMidName="Cheeko",LastName="Madus",EnrollmentDate=DateTime.Parse("2005-09-01")},

             new Student{FirstMidName="Datson",LastName="Palton",EnrollmentDate=DateTime.Parse("2005-09-01")},
            new Student{FirstMidName="Zakky",LastName="Chan",EnrollmentDate=DateTime.Parse("2002-09-01")},
            new Student{FirstMidName="Arbele",LastName="Dan",EnrollmentDate=DateTime.Parse("2003-09-01")},
            new Student{FirstMidName="Dalton",LastName="Evan",EnrollmentDate=DateTime.Parse("2002-09-01")},
            new Student{FirstMidName="Joshua",LastName="Bigit",EnrollmentDate=DateTime.Parse("2002-09-01")},
            new Student{FirstMidName="Elizabeth",LastName="Judge",EnrollmentDate=DateTime.Parse("2001-09-01")},
            new Student{FirstMidName="Peter",LastName="Theory",EnrollmentDate=DateTime.Parse("2003-09-01")},
            new Student{FirstMidName="Ninol",LastName="Olivia",EnrollmentDate=DateTime.Parse("2005-09-01")},
            new Student{FirstMidName="Newton",LastName="Isaack",EnrollmentDate=DateTime.Parse("2005-09-01")},
            new Student{FirstMidName="Sasha",LastName="Brain",EnrollmentDate=DateTime.Parse("2007-09-01")},
            new Student{FirstMidName="Aliba",LastName="Zate",EnrollmentDate=DateTime.Parse("2003-09-01")},
            new Student{FirstMidName="Raman",LastName="Rastogi",EnrollmentDate=DateTime.Parse("2003-07-01")},
            new Student{FirstMidName="Chan",LastName="Doodle",EnrollmentDate=DateTime.Parse("2009-09-01")},
            new Student{FirstMidName="Andy",LastName="Sam",EnrollmentDate=DateTime.Parse("2005-09-01")},
            new Student{FirstMidName="Sasson",LastName="Saca",EnrollmentDate=DateTime.Parse("2007-08-01")},
            new Student{FirstMidName="Cito",LastName="Moran",EnrollmentDate=DateTime.Parse("2005-07-01")}
           
            };

            students.ForEach(s => context.Students.Add(s));
            context.SaveChanges();
            var courses = new List<Course>
            {
            new Course{CourseID=1050,Title="Chemistry",Credits=3,},
            new Course{CourseID=4022,Title="Microeconomics",Credits=3,},
            new Course{CourseID=4041,Title="Macroeconomics",Credits=3,},
            new Course{CourseID=1045,Title="Calculus",Credits=4,},
            new Course{CourseID=3141,Title="Trigonometry",Credits=4,},
            new Course{CourseID=2021,Title="Composition",Credits=3,},
            new Course{CourseID=2042,Title="Literature",Credits=4,}
            };
            courses.ForEach(s => context.Courses.Add(s));
            context.SaveChanges();
            var enrollments = new List<Enrollment>
            {
            new Enrollment{StudentID=1,CourseID=1050,Grade=Grade.A},
            new Enrollment{StudentID=1,CourseID=4022,Grade=Grade.C},
            new Enrollment{StudentID=1,CourseID=4041,Grade=Grade.B},
            new Enrollment{StudentID=2,CourseID=1045,Grade=Grade.B},
            new Enrollment{StudentID=2,CourseID=3141,Grade=Grade.F},
            new Enrollment{StudentID=2,CourseID=2021,Grade=Grade.F},
            new Enrollment{StudentID=3,CourseID=1050},
            new Enrollment{StudentID=4,CourseID=1050,},
            new Enrollment{StudentID=4,CourseID=4022,Grade=Grade.F},
            new Enrollment{StudentID=5,CourseID=4041,Grade=Grade.C},
            new Enrollment{StudentID=6,CourseID=1045},
            new Enrollment{StudentID=7,CourseID=3141,Grade=Grade.A},
            };
            enrollments.ForEach(s => context.Enrollments.Add(s));
            context.SaveChanges();
        }
    }
}
