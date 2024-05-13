import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    flex: 1,
    justifyContent:"center",
    textAlign: 'center',
    gap: 5,
    margin: 10
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },

// MARCAR AULA STYLE
  container1: {
    paddingHorizontal: 8,
    justifyContent:"center",
    textAlign: 'center',
    gap: 5,
    margin: 10,
    marginTop: '50%'
  },
  container2: {
    paddingHorizontal: 8,
    justifyContent:"center",
    textAlign: 'center',
    gap: 5,
    margin: 10,
    marginTop: '35%'
  },

  //Input ADD/DEL
  input2: {
    borderRadius: 5,
    borderColor: '#000',
    paddingHorizontal: 10,
    color:'#000',
    borderWidth: 2,
    width: '70%',
    height: 50,
    marginBottom: 10,
},
});