## CI/CD

This project uses GitHub Actions for continuous integration.

### Backend CI
The backend workflow:
- installs Python dependencies
- initializes the database
- verifies application imports
- checks database table creation

### Frontend CI
The frontend workflow:
- installs Node dependencies
- builds the Next.js application
- catches compile/build-time errors automatically

These workflows run on push and pull request for:
- main
- develop
- feature branches