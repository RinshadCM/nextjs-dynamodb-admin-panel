// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete';


import { useState, useEffect } from 'react'
import axios from 'axios'
import React from 'react'
import toast, { Toaster } from 'react-hot-toast'

const rows = [
  {
    age: 27,
    status: 'current',
    date: '09/27/2018',
    name: 'Sally Quinn',
    salary: '$19586.23',
    email: 'eebsworth2m@sbwire.com',
    designation: 'Human Resources Assistant'
  }
  // {
  //   age: 61,
  //   date: '09/23/2016',
  //   salary: '$23896.35',
  //   status: 'professional',
  //   name: 'Margaret Bowers',
  //   email: 'kocrevy0@thetimes.co.uk',
  //   designation: 'Nuclear Power Engineer'
  // },
  // {
  //   age: 59,
  //   date: '10/15/2017',
  //   name: 'Minnie Roy',
  //   status: 'rejected',
  //   salary: '$18991.67',
  //   email: 'ediehn6@163.com',
  //   designation: 'Environmental Specialist'
  // },
  // {
  //   age: 30,
  //   date: '06/12/2018',
  //   status: 'resigned',
  //   salary: '$19252.12',
  //   name: 'Ralph Leonard',
  //   email: 'dfalloona@ifeng.com',
  //   designation: 'Sales Representative'
  // },
  // {
  //   age: 66,
  //   status: 'applied',
  //   date: '03/24/2018',
  //   salary: '$13076.28',
  //   name: 'Annie Martin',
  //   designation: 'Operator',
  //   email: 'sganderton2@tuttocitta.it'
  // },
  // {
  //   age: 33,
  //   date: '08/25/2017',
  //   salary: '$10909.52',
  //   name: 'Adeline Day',
  //   status: 'professional',
  //   email: 'hnisius4@gnu.org',
  //   designation: 'Senior Cost Accountant'
  // },
  // {
  //   age: 61,
  //   status: 'current',
  //   date: '06/01/2017',
  //   salary: '$17803.80',
  //   name: 'Lora Jackson',
  //   designation: 'Geologist',
  //   email: 'ghoneywood5@narod.ru'
  // },
  // {
  //   age: 22,
  //   date: '12/03/2017',
  //   salary: '$12336.17',
  //   name: 'Rodney Sharp',
  //   status: 'professional',
  //   designation: 'Cost Accountant',
  //   email: 'dcrossman3@google.co.jp'
  // }
]

const statusObj = {
  applied: { color: 'info' },
  rejected: { color: 'error' },
  current: { color: 'primary' },
  resigned: { color: 'warning' },
  professional: { color: 'success' }
}

const DashboardTable = () => {
  const [userList, setuserList] = useState([])

  // useEffect(() => {
  //   console.log(userList);
  // }, [userList]);

  useEffect(() => {
    axios({
      method: 'get',
      withCredentials: true,
      url: 'http://localhost:4000/get-companies'
    }).then(data => {
      console.log(data)
      setuserList(data.data)
    })
  }, [])

  useEffect(() => {
    console.log(userList)
  })

  const message = () => {
    return (
      <div className='flex items-center justify-betwen'>
        <div className='text-white'>{/* <AiFillCheckCircle /> */}</div>
        <div className=' ml-2 font-inter text-white text-[14px] '>Details deleted successfully!</div>
      </div>
    )
  }

  const notify = () => {
    toast(message, {
      position: 'top-center',
      style: {
        width: 'fit-content',
        borderRadius: '9999px',
        fontFamily: 'Inter',
        backgroundColor: 'black'
      }
    })
    // Router.push("/userDashboard/companies");
  }

  const handleDelete = async key => {
    notify()
    console.log(key)
    await axios({
      method: 'delete',
      url: `http://localhost:4000/delete-company/${key}`
    })
    // Router.push("/userDashboard/companies");
    window.location.reload()
  }

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              {/* <TableCell>Age</TableCell> */}
              <TableCell className='action'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map(element => (
              <TableRow hover key={element.name} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>
                      {element.fname} {element.lname}
                    </Typography>
                    {/* <Typography variant='caption'>{element.designation}</Typography> */}
                  </Box>
                </TableCell>
                <TableCell>{element.email}</TableCell>
                <TableCell>{element.roles}</TableCell>
                {/* <TableCell>{element.age}</TableCell> */}
                <TableCell>
                  <CardActions className='card-action-dense' sx={{ width: '100%' }}>
                  <Button variant='outlined'>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(element.email)} startIcon={<DeleteIcon />}>Delete</Button>
                  </CardActions>
                  {/* <Chip
                    label={element.status}
                    // color={statusObj[element.status].color}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  /> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default DashboardTable
