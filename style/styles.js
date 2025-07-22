import { StyleSheet } from "react-native";
/*
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#F7EFDF',
  },
  header: {
    backgroundColor: '#0091EA',
    paddingTop: 50,
    paddingBottom: 16,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0091EA',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  headerLogo: {
    width: 60,
    height: 60,
  },
  headerTextHome: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    marginRight: 12,
  },
  logoutButton: {
    padding: 6,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  form: {
    backgroundColor: '#F7EFDF',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    height: 40,
    borderColor: '#bbbbbb',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 4,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#0091EA',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 10,
  },
  buttonIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  panicContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  panicButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    elevation: 4,
    marginBottom: 8,
  },
  panicText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 8,
  },
  optionsContainer: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    elevation: 2,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 18,
    color: '#222',
  },
});
