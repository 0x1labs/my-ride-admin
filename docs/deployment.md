# Deployment Guide

This guide provides instructions for deploying the MyRide Vehicle Service Management System to various hosting platforms.

## Prerequisites

Before deploying, ensure you have:
1. A production-ready build of the application
2. All environment variables configured
3. A Supabase project set up and configured
4. Access to your chosen deployment platform

## Environment Variables

Ensure the following environment variables are set in your deployment environment:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

Never commit these values to version control. Use your deployment platform's secret management system.

## Building for Production

### Standard Build
```bash
npm run build
```

This creates a production-ready build in the `dist/` directory.

### Development Build (for testing)
```bash
npm run build:dev
```

## Deployment Options

### Option 1: Lovable (Recommended)

The easiest way to deploy this application is through Lovable:

1. Open your [Lovable Project](https://lovable.dev/projects/207dd849-7efa-408f-bd08-60ca46fbf44a)
2. Navigate to Share -> Publish
3. Follow the prompts to deploy your application

Benefits:
- No infrastructure management
- Automatic SSL certificates
- Built-in analytics
- Easy custom domain setup

### Option 2: Vercel

1. Sign up for a Vercel account
2. Connect your Git repository
3. Configure the project settings:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables in the Vercel dashboard
5. Deploy!

### Option 3: Netlify

1. Sign up for a Netlify account
2. Connect your Git repository or drag and drop the `dist/` folder
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in the Netlify dashboard
5. Deploy!

### Option 4: AWS S3 + CloudFront

1. Create an S3 bucket for static website hosting
2. Build the application:
   ```bash
   npm run build
   ```
3. Upload the contents of the `dist/` directory to your S3 bucket
4. Configure CloudFront to serve the S3 bucket content
5. Set up SSL certificate using AWS Certificate Manager
6. Configure environment variables using AWS Systems Manager Parameter Store

### Option 5: Traditional Web Server

1. Build the application:
   ```bash
   npm run build
   ```
2. Copy the contents of the `dist/` directory to your web server's document root
3. Configure your web server (Apache, Nginx, etc.) to serve the static files
4. Set up SSL certificate (e.g., using Let's Encrypt)
5. Configure environment variables on the server

## Supabase Configuration

### Production Database Setup

1. Create a new Supabase project for production
2. Set up the database tables using the schema from the API documentation
3. Configure Row Level Security (RLS) policies
4. Set up authentication providers
5. Configure environment variables in your deployment platform

### Database Migration

If migrating from a development database:

1. Export data from development database
2. Transform data if necessary to match production schema
3. Import data into production database
4. Verify data integrity

## Environment-Specific Configuration

### Development
```env
VITE_SUPABASE_URL=your_development_supabase_url
VITE_SUPABASE_ANON_KEY=your_development_supabase_anon_key
```

### Staging
```env
VITE_SUPABASE_URL=your_staging_supabase_url
VITE_SUPABASE_ANON_KEY=your_staging_supabase_anon_key
```

### Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## Custom Domain Setup

### Using Lovable
1. Navigate to Project > Settings > Domains
2. Click "Connect Domain"
3. Follow the step-by-step guide in the [Lovable documentation](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

### Using Vercel/Netlify
1. Add your domain in the project settings
2. Configure DNS records as instructed by the platform
3. Wait for SSL certificate provisioning

### Using AWS
1. Request a certificate in AWS Certificate Manager
2. Create an alias record in Route 53 pointing to your CloudFront distribution
3. Wait for DNS propagation

## SSL Certificates

Most deployment platforms provide automatic SSL certificate management:
- Lovable: Automatic
- Vercel: Automatic with custom domains
- Netlify: Automatic with custom domains
- AWS: Use AWS Certificate Manager

For self-managed deployments, consider using Let's Encrypt.

## Monitoring and Analytics

### Application Monitoring
- Set up error tracking with Sentry or similar services
- Implement performance monitoring
- Set up uptime monitoring

### Analytics
The application includes basic analytics through the Analytics Dashboard. For enhanced analytics:

1. Integrate with Google Analytics:
   ```html
   <!-- Add to index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

2. Set up Supabase Analytics for database insights

## Backup and Recovery

### Application Code
- Use Git for version control
- Push to multiple remote repositories
- Tag releases for easy rollback

### Database
- Enable Supabase database backups
- Schedule regular exports of critical data
- Test restore procedures periodically

### Environment Configuration
- Document all environment variables
- Store secrets securely
- Version control non-sensitive configuration

## Performance Optimization

### Build Optimization
- Enable compression on your web server
- Use a CDN for static assets
- Optimize images and other media

### Database Optimization
- Add appropriate database indexes
- Monitor query performance
- Optimize Supabase functions if used

### Caching
- Implement HTTP caching headers
- Use service workers for offline functionality
- Consider implementing a caching layer for frequently accessed data

## Security Considerations

### Application Security
- Keep dependencies up to date
- Regularly audit packages for vulnerabilities
- Implement proper authentication and authorization

### Data Security
- Use encrypted connections (HTTPS)
- Encrypt sensitive data at rest
- Regularly rotate API keys and secrets

### Access Control
- Implement proper user roles and permissions
- Regularly review access logs
- Set up alerts for suspicious activity

## Troubleshooting Deployment Issues

### Common Issues

1. **Environment Variables Not Loading**
   - Verify variable names match exactly
   - Check for typos in .env files
   - Ensure variables are set in deployment platform

2. **Blank Page After Deployment**
   - Check browser console for errors
   - Verify all environment variables are set
   - Confirm build was successful

3. **API Connection Errors**
   - Verify Supabase URL and key
   - Check network connectivity
   - Ensure database RLS policies are correct

4. **Performance Issues**
   - Check bundle size
   - Optimize images and assets
   - Implement caching strategies

### Rollback Procedures

1. Identify the last stable deployment
2. Revert to the previous version using your deployment platform's rollback feature
3. Update environment variables if needed
4. Monitor for issues after rollback

## Maintenance

### Regular Tasks
- Update dependencies regularly
- Monitor application performance
- Review and rotate secrets
- Backup critical data

### Updates
1. Test updates in a staging environment
2. Deploy to production during low-usage periods
3. Monitor for issues after deployment
4. Have a rollback plan ready

## Support

For deployment-related issues:
1. Check the platform-specific documentation
2. Review error logs
3. Contact the platform's support team
4. Reach out to the development team for application-specific issues