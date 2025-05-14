const { Student, Course, Enrollment, sequelize } = require('./models');
const { syncPromise } = require('./orm');

async function transferStudent(studentId, oldDeptId, newDeptId) {
  const t = await sequelize.transaction();
  try {
    // 1. 查找學生是否存在
    const student = await Student.findByPk(studentId, { transaction: t });
    if (!student) {
      console.log(`學生 ${studentId} 不存在，轉系中止。`);
      await t.rollback();
      return;
    }

    // 2. 更新學生的系所
    student.Department_ID = newDeptId;
    await student.save({ transaction: t });

    // 3. 查找舊系必修課程
    const oldRequiredCourses = await Course.findAll({
      where: {
        Department_ID: oldDeptId,
        Is_Required: true
      },
      transaction: t
    });

    // 4. 標記舊系必修為「轉系退選」
    await Promise.all(oldRequiredCourses.map(course => {
      return Enrollment.update(
        { Status: '轉系退選' },
        {
          where: {
            Student_ID: studentId,
            Course_ID: course.Course_ID
          },
          transaction: t
        }
      );
    }));

    // 5. 查找新系必修課程
    const newRequiredCourses = await Course.findAll({
      where: {
        Department_ID: newDeptId,
        Is_Required: true
      },
      transaction: t
    });

    const currentSemester = '112-2';

    // 6. 加選新系必修課程
    await Promise.all(newRequiredCourses.map(course => {
      return Enrollment.create({
        Student_ID: studentId,
        Course_ID: course.Course_ID,
        Semester_ID: currentSemester,
        Status: '轉系加選'
      }, { transaction: t });
    }));

    await t.commit();
    console.log(`學生 ${studentId} 已從 ${oldDeptId} 轉到 ${newDeptId}`);
  } catch (err) {
    await t.rollback();
    console.error('轉系處理失敗：', err);
  }
}

syncPromise
  .then(() => {
    return transferStudent('S10811005', 'CS001', 'EE001');
  })
  .catch((err) => {
    console.error('初始化失敗，轉系功能未執行：', err);
  });