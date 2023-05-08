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
import { Padding } from '@mui/icons-material'


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
    <>
      <Button href='/add' variant='contained' style={{marginBottom:'1.5rem'}}>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#fff" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6h-2Z"/></svg>
      Add User
      </Button>
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
                  <Button variant='outlined' href={`/users/${element.email}`} passHref>Edit</Button>
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
    </>
  )
}

export default DashboardTable
