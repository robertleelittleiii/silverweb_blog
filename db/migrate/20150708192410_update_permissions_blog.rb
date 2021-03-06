class UpdatePermissionsBlog < ActiveRecord::Migration
  def self.up
    
		#Admin role name should be "Admin" for convenience
    #role_sales = Role.new
		#role_sales.name = "Sales"
		#role_sales.save
    #
    #Create all of the rights for all existing controllers for the admin
    #assign them to Admin role.
    role_admin =  Role.find_by_name('Admin')
    role_cust =  Role.find_by_name('Customer')
    role_siteowner =  Role.find_by_name('Site Owner')


    right = Right.create name: "*Access to all articles actions", controller: "articles", action: "*"
    role_admin.rights << right
    role_siteowner.rights << right
    
    right = Right.create name: "*Access to all comment actions", controller: "comments", action: "*"
    role_admin.rights << right
    role_siteowner.rights << right
   
   
    role_siteowner.save
    role_cust.save
    role_admin.save 
    
  end

  def self.down
    #Destroy all rights    
    right = Right.find_by_name( "*Access to all articles actions")
    right.destroy  rescue puts("*** Articles right not found.")

    right = Right.find_by_name( "*Access to all comment actions")
    right.destroy  rescue puts("*** Comment right not found.")
  end
  
end
