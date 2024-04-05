angular.module("EmployeeApp", []).controller("EmployeeController", [
    "$scope",
    "$http",
    function ($scope, $http) {
        $scope.newEmployee = {};
        $scope.employees = [];
        $scope.updatedEmployee = {};
        // Get employees
        $http
            .get("http://localhost:3000/api/employees")
            .then(function (response) {
                $scope.employees = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching employees:", error);
            });

        // Add employee
        $scope.addEmployee = function () {
            $http
                .post("http://localhost:3000/api/employees", $scope.newEmployee)
                .then(function (response) {
                    $scope.employees.push(response.data);
                    $scope.newEmployee = {};
                    M.Modal.getInstance(document.getElementById("addEmployeeModal")).close();
                })
                .catch(function (error) {
                    console.error("Error adding employee:", error);
                });
        };

        // Search employee
        $scope.searchEmployee = function () {
            $http
                .post("http://localhost:3000/api/employees/search", { query: $scope.searchQuery })
                .then(function (response) {
                    $scope.employees = response.data ? [response.data] : [];
                    $scope.searchQuery = "";
                    M.Modal.getInstance(document.getElementById("searchEmployeeModal")).close();
                })
                .catch(function (error) {
                    console.error("Error searching employee:", error);
                });
        };

        // Delete employee
        $scope.deleteEmployee = function () {
            $http
                .post("http://localhost:3000/api/employees/delete", { query: $scope.deleteQuery })
                .then(function (response) {
                    $scope.employees = response.data;
                    $scope.deleteQuery = "";
                    M.Modal.getInstance(document.getElementById("deleteEmployeeModal")).close();
                })
                .catch(function (error) {
                    console.error("Error deleting employee:", error);
                });
        };

        $scope.updateEmployee = function () {
            console.log($scope.updatedEmployee);
            $http
                .put("http://localhost:3000/api/employees/update", $scope.updatedEmployee)
                .then(function (response) {
                    $scope.employees = response.data; // Update the employees list
                    // $scope.updatedEmployee = {};
                    M.Modal.getInstance(document.getElementById("updateEmployeeModal")).close(); // Close the modal
                })
                .catch(function (error) {
                    console.error("Error updating employee:", error.message);
                });
        };
    }
]);
