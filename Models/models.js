import { DataTypes } from 'sequelize'
import { sequelize } from '../sequelize.js'
import  jwt  from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({path : './cfg.env'});

// Define User model
const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        args: true,
        msg: 'Please enter a valid email'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['1', '2', '3', 'An suplimentar']],
    },
  },
  group: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: 1080,
        msg: 'Please enter a group number.'
      },
      max: {
        args: 1092,
        msg: 'Please enter a group number.'
      }
    },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['student', 'professor' , 'judge']],
      },
    }
  }
});

// Add method to generate JWT
User.prototype.getSignedJwtToken = function () {
  return jwt.sign({ userId: this.userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
// Generate random  number to get a chance to become a reviewer

User.prototype.assignRandomReviewer = function() {
    if (this.role === 'student') {
        this.random = Math.floor(Math.random() * 100) + 1;
        return this.random;
    }
}

// Define Project model
const Project = sequelize.define('Project', {
  projectId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 40],
        msg: 'Title must be 40 characters or less.',
      },
    },
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 30],
        msg: 'Author must be 30 characters or less.',
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 300],
        msg: 'Description must be 300 characters or less.',
      },
    },
  },
  videoLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  averageGrade: {
    type: DataTypes.INTEGER,
    validate: {
      min: {
        args: 1,
        msg: 'Average grade must be between 1 and 10.',
      },
      max: {
        args: 10,
        msg: 'Average grade must be between 1 and 10.',
      },
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'userId',
    },
  },
});

/// Define Judgment model
const Judgment = sequelize.define('Judgment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: 1,
        msg: 'Grade must be between 1 and 10.',
      },
      max: {
        args: 10,
        msg: 'Grade must be between 1 and 10.',
      },
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'userId',
    },
  },
  projectId: {
    type: DataTypes.INTEGER,
    references: {
      model: Project,
      key: 'projectId',
    },
  },
  projectTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },

  // Prevent user from submitting more than 1 judgment for project
}, {
  uniqueKeys: {
      uniqueJudgment: {
          fields: ['userId', 'projectId']
      }
  }
});

// Add beforeSave hook to Judgment model
Judgment.addHook('beforeSave', async (judgment, options) => {
  const project = await Project.findByPk(judgment.projectId);
  judgment.projectTitle = project.title;
});
//
Judgment.getAverageGrade = async function (projectId) {
  try {
      const judgments = await this.findAll({
          where: { projectId },
          attributes: ['grade']
      });

      if (judgments.length === 0) {
          return 0;
      }

      const grades = judgments.map(judgment => judgment.grade);
      const minGrade = Math.min(...grades);
      const maxGrade = Math.max(...grades);
      const sumGrade = grades.reduce((sum, grade) => sum + grade, 0);

      let avg;
      if (grades.length > 2) {
          avg = (sumGrade - minGrade - maxGrade) / (grades.length - 2);
      } else {
          avg = sumGrade / grades.length;
      }

      // Update the project's average grade
      const Project = sequelize.models.Project;
      await Project.update({ averageGrade: avg.toFixed(2) }, { where: { id: projectId } });

      return avg;
  } catch (err) {
      console.error(err);
  }
};
// Call getAverageGrade after save
Judgment.addHook('afterSave', async (judgment, options) => {
  await Judgment.getAverageGrade(judgment.projectId);
});

// Call getAverageGrade before destroy
Judgment.addHook('beforeDestroy', async (judgment, options) => {
  await Judgment.getAverageGrade(judgment.projectId);
});

const ProjectRequirements = sequelize.define('ProjectRequirements', {
  title: {
      type: DataTypes.STRING,
      trim: true,
      validate: {
          len: {
              args: [0, 50],
              msg: 'Title should not be more than 50 characters'
          }
      }
  },
  description: {
      type: DataTypes.STRING,
      validate: {
          len: {
              args: [0, 500],
              msg: 'Description should not be more than 500 characters'
          }
      }
  },
  deadline: {
      type: DataTypes.DATE
  },
  status: {
      type: DataTypes.STRING
  }
});

export { User, Project, Judgment ,ProjectRequirements};

