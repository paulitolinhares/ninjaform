$(function() {
  // Load ninjaform
  $('#ninjaform').ninjaform({ 
    'token':'93b98d24dcefe654d330b0b791e2ca5d', 
    'secret':'7838a8f11115002fbf1c056511452388', 
    'fields':{ 
      'estado':['PR','SC','SP','RS'], 
      'nível':['Iniciante','Intermediário','Avançado','Ninja'] 
    } 
  });
});