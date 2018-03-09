///////////////////////////////////////////////////
////////////////// Directives ////////////////// //
////////////////////////////////////////////////////

pos.directive('navMenu',function ($location) {
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: 'templates/directives/nav-menu.html',
    link: function (scope) {

      scope.isActive = function (url) {
        if (url === 'transactions')
          url = 'transaction';

        url = '/' + url;
        return $location.path().indexOf(url) !== -1;
      }

    }
  };

});

pos.directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
      $timeout(function() {
        $element[0].focus();
      });
    }
  }
}]);

pos.directive('productForm',function ($location) {
  return {
    restrict: 'E',
    scope: {
      product: '=',
      onSave: '&'
    },
    templateUrl: 'templates/directives/product-form.html',
    link: function (scope, el) {

      // highlight barcode field
      var $barcode = el.find('form').eq(0).find('input').eq(0);
      var $name = el.find('form').eq(0).find('input').eq(1);
      $barcode.select();

      scope.tabOnEnter = function ($event) {
        if ($event.keyCode === 13) {
          $name.select();
          $event.preventDefault();
        }
      };

      scope.save = function () {
        scope.onSave({ product: scope.product });
      };

    }
  };

});

pos.directive('addManualItem',function () {
  return {
    restrict: 'E',
    scope: {
      addItem: '&'
    },
    templateUrl: 'templates/directives/add-manual-item.html',
    link: function (scope, el) {

      scope.add = function () {
        scope.manualItem.name = "----";
        scope.addItem({item: scope.manualItem});
        el.find('div').eq(0).modal('hide');
        scope.manualItem = '';
      };

    }
  };

});

pos.directive('checkout', function (Settings) {
  return {
    restrict: 'E',
    scope: {
      printReceipt: '&',
      cartTotal: '=',
      cart: '='
    },
    templateUrl: 'templates/directives/checkout.html',
    link: function (scope, el) {

      $paymentField = el.find('form').eq(0).find('input').eq(0);

      console.log('link  checkout ');
      $('#checkoutModal').on('shown.bs.modal', function () {
        $('#checkoutPaymentAmount').trigger('focus');
        console.log('trigger focus!');
      });

      $('#checkoutModal').on('hidden.bs.modal', function (e) {
        scope.cleanModal();
        console.log('cleanModal call!');
      });

      scope.focusPayment = function () {
          console.log('focusPayment ');
        $('#checkoutPaymentAmount').select();
      };

      scope.getChangeDue = function () {
        if (scope.paymentAmount && scope.paymentAmount > scope.cartTotal) {
          var change =  parseFloat(scope.paymentAmount) - parseFloat(scope.cartTotal);
          return change;
        }
        else
          return 0;
      };

      scope.print = function () {
        if (scope.cartTotal > scope.paymentAmount) return;

        var paymentAmount = angular.copy(scope.paymentAmount);

        scope.previousCartInfo = {
          total: angular.copy(scope.cartTotal),
          paymentAmount: paymentAmount,
        };

        scope.printReceipt({ payment: paymentAmount });
        scope.transactionComplete = true;
        $('.close').trigger('focus');
      };

      scope.closeModal = function () {
        el.find('div').eq(0).modal('hide');
        delete scope.paymentAmount;
        scope.transactionComplete = false;
      };

      scope.cleanModal = function () {
        delete scope.paymentAmount;
        scope.transactionComplete = false;
      };

    }
  };

});

pos.directive('receipt',function (Settings) {
  return {
    restrict: 'E',
    scope: {
      transaction: '='
    },
    templateUrl: 'templates/directives/receipt.html',
    link: function (scope) {

      scope.backupDate = new Date();

      Settings.get().then(function (settings) {
        scope.settings = settings;
      });

    }
  };

});
