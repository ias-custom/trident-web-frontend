import React from 'react'
import { compose } from 'redux'
import { withStyles, Button } from '@material-ui/core'
import styles from './styles'
import PropTypes from 'prop-types';
import { CheckCircle } from '@material-ui/icons'

const ButtonsMap = ({...props}) => {
  const {tab, type, classes, itemValue, addItem, projectId} = props

  return (
    ((tab === 5 && type === 1) || (tab === 4 && type === 2)) && (
      <div className={classes.divMenu}>
        <Button
          variant="outlined"
          className={classes.buttonMenu}
          onClick={() => {
            addItem(1, `/projects/${projectId}/structures/create`)
          }}
        >
          Add structure
          {itemValue === 1 ? (
            <CheckCircle className={classes.iconButtonMenu}></CheckCircle>
          ) : null}
        </Button>
        {type === 1 && (
          <Button
            variant="outlined"
            className={classes.buttonMenu}
            onClick={() => {
              addItem(2, `/projects/${projectId}/spans/create`)
            }}
          >
            Add span
            {itemValue === 2 ? (
              <CheckCircle className={classes.iconButtonMenu}></CheckCircle>
            ) : null}
          </Button>
        )}
        {type === 1 && (
          <Button
            variant="outlined"
            className={classes.buttonMenu}
            onClick={() => {
              addItem(3, `/projects/${projectId}/crossings/create`)
            }}
          >
            Add crossing
            {itemValue === 3 ? (
              <CheckCircle className={classes.iconButtonMenu}></CheckCircle>
            ) : null}
          </Button>
        )}
        {type === 1 && (
          <Button
            variant="outlined"
            className={classes.buttonMenu}
            onClick={() =>{
              addItem(4, `/projects/${projectId}/access/create`)
            }}
          >
            Add access
            {itemValue === 4 ? (
              <CheckCircle className={classes.iconButtonMenu}></CheckCircle>
            ) : null}
          </Button>
        )}
        <Button
          variant="outlined"
          className={classes.buttonMenu}
          onClick={() => {
            addItem(5, `/projects/${projectId}/interactions/create`)
          }}
        >
          Add interaction
          {itemValue === 5 ? (
            <CheckCircle className={classes.iconButtonMenu}></CheckCircle>
          ) : null}
        </Button>
      </div>
    )
  )    
}

ButtonsMap.propTypes = {
  tab: PropTypes.number,
  type: PropTypes.number,
  addItem: PropTypes.func.isRequired,
  itemValue: PropTypes.number
};

ButtonsMap.defaultProps = {
  tab: 5,
  type: 1,
  addItem: () => {},
  itemValue: 0
}

export default compose(withStyles(styles))(ButtonsMap)