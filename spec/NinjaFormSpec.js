describe('NinjaForm', function () {

  describe('Basic features (no modal generation)', function(){
    var options;
    beforeAll(function(){
      options = { 
        'token':'93b98d24dcefe654d330b0b791e2ca5d', 
        'secret':'7838a8f11115002fbf1c056511452388', 
        'fields':{ 
          'estado':['PR','SC','SP','RS'], 
          'nível':['Iniciante','Intermediário','Avançado','Ninja'] 
        } 
      };
      $('body').append('<div id="integration_form"></div>'); 
      $('#integration_form').ninjaform(options);
    });

    it('should generate form', function(){
      var formCount = $('#integration_form form').length;
      var textInputCount = $('#integration_form input[type="text"]').length;
      var emailInputCount = $('#integration_form input[type="email"]').length;
      var selectCount = $('#integration_form select').length;
      var submitCount = $('#integration_form button[type="submit"]').length;
      expect(formCount).toEqual(1);
      expect(textInputCount).toEqual(1);
      expect(emailInputCount).toEqual(1);
      expect(selectCount).toEqual(2);
      expect(submitCount).toEqual(1);
    });

    it('should generate flash container', function(){
      var flashCount = $('#integration_form .ninjaform-flashContainer').length;
      expect(flashCount).toEqual(1);
    });

    it('should validate form', function(){
      $('#integration_form input[name="name"]').val('');
      $('#integration_form input[name="email"]').val('');
      $('#integration_form .ninjaform-submit').click();
      var flashText = $('#integration_form .ninjaform-flashContainer').text();
      expect(flashText).toMatch("Verifique os erros no formulário");
    });
  });

  describe('Multiple form generation', function(){
    it('should cover multiple forms', function(){
      var formCount = 3;
      options = { 
        'token':'93b98d24dcefe654d330b0b791e2ca5d', 
        'secret':'7838a8f11115002fbf1c056511452388', 
        'fields':{ 
          'estado':['PR','SC','SP','RS'], 
          'nível':['Iniciante','Intermediário','Avançado','Ninja'] 
        } 
      };
      for(var i = 0; i < formCount; i++){
        $('body').append('<div class="integration_form"></div>'); 
      }
      $('.integration_form').ninjaform(options);

      var formResult = $('.integration_form form').length;

      expect(formResult).toEqual(formCount);
    });
  });

  describe('Bonus feature (generating modal)', function(){
    var options;
    beforeAll(function(){
      options = { 
        'token':'93b98d24dcefe654d330b0b791e2ca5d',
        'secret':'7838a8f11115002fbf1c056511452388', 
        'modal':true, 
        'fields':{ 
          'estado':['PR','SC','SP','RS'], 
          'nível':['Iniciante','Intermediário','Avançado','Ninja']
        } 
      };
      $('body').append('<a href="#" class="integration_link">Abrir modal</a>'); 
      $('.integration_link').ninjaform(options); 
    });

    it('should generate modal', function(){
      var modalCount = $('#ninjaform-modal').length;

      expect(modalCount).toEqual(1);
    });
  });
});