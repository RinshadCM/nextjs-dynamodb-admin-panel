// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'

import { GrClose } from 'react-icons/gr'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { useRef, useState, useEffect } from 'react'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const TabAccount = () => {
  // ** State
  const [openAlert, setOpenAlert] = useState(true)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
    }
  }

  const message = () => {
    return (
      <div className='flex items-center justify-betwen'>
        <div className='text-white'>{/* <AiFillCheckCircle /> */}</div>
        <div className=' ml-2 font-inter text-white text-[14px] '>Details saved successfully!</div>
      </div>
    )
  }

  const notify = () =>
    toast(message, {
      position: 'top-center',
      style: {
        width: 'fit-content',
        borderRadius: '9999px',
        fontFamily: 'Inter',
        backgroundColor: 'black'
      }
    })

  const fileRef = useRef(null)

  const [userEmail, setuserEmail] = useState('')
  const [pass, setPass] = useState('')
  const [companyLogo, setCompanyLogo] = useState('')
  const [facebook, setFacebook] = useState('')
  const [activecheck, setActivecheck] = useState(true)
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [openings, setOpenings] = useState('')
  const [location, setLocation] = useState()
  const [tags, setTags] = useState()
  const [teamSize, setTeamSize] = useState('')
  const [aboutCompany, setAboutCompany] = useState('')
  const [roles, setRoles] = useState('Admin')

  const [companyDetails, setCompanyDetails] = useState([])
  const [userList, setuserList] = useState([])

  useEffect(() => {
    if (companyDetails) {
      setFacebook(companyDetails.facebook)
      setFname(companyDetails.link)
      setLname(companyDetails.lname)
      setActivecheck(companyDetails.activecheck)
      setOpenings(companyDetails.numberOfOpenings)
      setLocation(companyDetails.locations)
      setTags(companyDetails.tags)
      setTeamSize(companyDetails.teamSize)
      setAboutCompany(companyDetails.about)
      setRoles(companyDetails.totalFunding)
      //   setCompanyDescription(companyDetails.description)
    }
  }, [companyDetails])

  const handleSubmit = async e => {
    e.preventDefault()
    const company = {
      userEmail,
      pass,
      activecheck,
      fname,
      lname,
      companyLogo
    }

    const response = await axios({
      method: 'post',
      data: {
        email: userEmail,
        password: pass,
        fname: fname,
        lname: lname,
        activecheck: activecheck,
        image: companyLogo,
        roles: roles
      },
      // withCredentials: true,
      url: 'http://localhost:4000/create-company'
    })

    setuserList(userList => [...userList, response.data])
    setuserEmail('')
    setPass('')
    setFname('')
    setLname('')
    setActivecheck(true)
    setRoles('Admin')
    setCompanyLogo(null)
    // setModalOpen(false)
  }

  const handleFileChange = e => {
    const reader = new FileReader()
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }

    reader.onload = readerEvent => {
      setCompanyLogo(readerEvent.target.result)
    }
  }
  const removeImage = () => {
    setCompanyLogo(null)
  }

  const handleClose = e => {
    if (e.target.id === 'container') {
      setModalOpen(false)
    }
  }

  return (
    <CardContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='text'
              label='Email'
              placeholder=''
              value={userEmail}
              onChange={e => setuserEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Password'
              type='password'
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder='******'
              defaultValue=''
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='First Name'
              placeholder=''
              type='text'
              value={fname}
              onChange={e => setFname(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Last Name'
              placeholder=''
              type='text'
              value={lname}
              onChange={e => setLname(e.target.value)}
            />
          </Grid>

          {/* <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label='Status' defaultValue='active'>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
                <MenuItem value='pending'>Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label='Role' defaultValue='Admin' value={roles} onChange={e => setRoles(e.target.value)}>
                <MenuItem value='Admin'>Admin</MenuItem>
                <MenuItem value='Author'>Author</MenuItem>
                <MenuItem value='Supervisor'>Supervisor</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button type='submit' variant='contained' sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>
            {/* <Button type='reset' variant='outlined' color='secondary'>
              Reset
            </Button> */}
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
