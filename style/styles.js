import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryCream,
    padding: 20,
  },
  input: {
    backgroundColor: colors.secondaryWhite,
    borderColor: colors.secondaryBlueGray,
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    color: colors.primaryDark,
  },
  buttonPrimary: {
    backgroundColor: colors.primaryBlue,
    padding: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.secondaryWhite,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  forgotText: {
    color: colors.primaryBlue,
    textAlign: 'center',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  iconRow: {
  flexDirection: 'row',
  alignItems: 'center',
  },
});
